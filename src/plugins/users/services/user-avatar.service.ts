import { injectable } from 'tsyringe';
import type { UploadedFile } from 'express-fileupload';
import ImageResizeService from 'src/common/services/image-resize.service';
import { EntityStatus } from 'src/common/constants';
import FilesRepository from 'src/plugins/files/repositories/files.repository';
import UsersRepository from 'src/plugins/users/repositories/users.repository';
import FileUpload from 'src/common/services/file-upload';

@injectable()
export default class UserAvatarService {
    constructor(
        private readonly _imageResizeService: ImageResizeService,
        private readonly _filesRepository: FilesRepository,
        private readonly _usersRepository: UsersRepository,
        private readonly _fileUpload: FileUpload
    ) {

    }

    async uploadAvatar(authUserId: string, file: UploadedFile): Promise<void> {
        const originalImage = await this._imageResizeService.resizeImage(
            file.data,
            { width: 500, height: 500 }
        );

        const {
            fileName: originalFileName,
            filePath: originalImagePath
        } = await this._fileUpload.uploadFile(file.data, { format: originalImage.info.format });

        const originalFileEntity = await this._filesRepository.createOne({
            name: originalFileName,
            path: originalImagePath,
                entityStatus: EntityStatus.Active,
            type: `image/${originalImage.info.format}`,
            size: originalImage.info.size,
            meta: originalImage.config
        });

        await this._usersRepository.updateOneBy(
            { id: authUserId },
            { avatarId: originalFileEntity.id }
        );

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
            const { fileName, filePath } = await this._fileUpload.uploadFile(
                file.data,
                { format: originalImage.info.format }
            );

            await this._filesRepository.createOne({
                name: fileName,
                path: filePath,
                entityStatus: EntityStatus.Active,
                type: `image/${image.info.format}`,
                size: image.info.size,
                parentId: originalFileEntity.id,
                meta: image.config
            });
        }));
    }
}