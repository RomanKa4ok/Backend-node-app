import { OutputInfo } from 'sharp';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import sharp = require('sharp');
import { injectable } from 'tsyringe';

export type ResizeImageConfig = {
    width: number;
    height: number;
}

export type ResizeImageResult = {
    data: Buffer,
    info: OutputInfo,
    config: ResizeImageConfig
}

type ResizeImageOptions = {
    config: ResizeImageConfig[];
}

@injectable()

export default class ImageResizeService {
    processImage(data: Buffer, options: ResizeImageOptions): Promise<ResizeImageResult[]> {
        return Promise.all(options.config.map((config) => this.resizeImage(data, config)));
    }

    async resizeImage(data: Buffer, config: ResizeImageConfig): Promise<ResizeImageResult> {
        const result = await sharp(data).resize(config.width, config.height)
            .webp()
            .toBuffer({ resolveWithObject: true });

        return {
            data: result.data,
            info: result.info,
            config
        };
    }
}