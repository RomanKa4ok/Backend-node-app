import { injectable } from 'tsyringe';
import type { UploadedFile } from 'express-fileupload';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises'
import * as process from 'node:process';
import { join } from 'path';
import ImageResizeService from 'src/common/services/image-resize.service';
import { EntityStatus } from 'src/common/constants';
import FilesRepository from 'src/plugins/files/repositories/files.repository';
import UsersRepository from 'src/plugins/users/repositories/users.repository';

@injectable()
export default class UserAvatarService {
    constructor(
        private readonly _imageResizeService: ImageResizeService,
        private readonly _filesRepository: FilesRepository,
        private readonly _usersRepository: UsersRepository
    ) {

    }

    async uploadAvatar(authUserId: string, file: UploadedFile): Promise<void> {
        const fileFolder = join(process.cwd(), '.uploads');

        if (!existsSync(fileFolder)) {
            await mkdir(fileFolder, { recursive: true });
        }

        console.log(authUserId);
        const originalImage = await this._imageResizeService.resizeImage(
            file.data,
            { width: 500, height: 500 }
        );
        const originalFileName = `${file.md5}.${originalImage.info.format}`;
        const originalImagePath = join(fileFolder, originalFileName);
        const originalFileEntity = await this._filesRepository.createOne({
            name: originalFileName,
            path: originalImagePath,
                entityStatus: EntityStatus.Active,
            type: `image/${originalImage.info.format}`,
            size: originalImage.info.size,
            meta: originalImage.config
        });

        await this._usersRepository.updateOneBy({ id: authUserId }, { avatarId: originalFileEntity.id });

        await writeFile(originalImagePath, new Uint8Array(originalImage.data));

        const croppedImage = await this._imageResizeService.processImage(
            file.data,
            {
                config: [
                    { width: 200, height: 200 },
                    { width: 100, height: 100 }
                ]
            }
        );

        await Promise.all(croppedImage.map(async (image) => {
            const fileName = `${file.md5}-${image.info.width}x${image.info.height}.${image.info.format}`;
            const imagePath = join(fileFolder, fileName);

            await writeFile(imagePath, new Uint8Array(image.data));

            await this._filesRepository.createOne({
                name: fileName,
                path: imagePath,
                entityStatus: EntityStatus.Active,
                type: `image/${image.info.format}`,
                size: image.info.size,
                parentId: originalFileEntity.id,
                meta: image.config
            });
        }));
    }
}