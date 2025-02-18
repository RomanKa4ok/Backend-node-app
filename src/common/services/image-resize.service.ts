import { OutputInfo } from 'sharp';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import sharp = require('sharp');
import { injectable } from 'tsyringe';

export type ResizeImageConfig = {
    width: number;
    height: number;
}

type ResizeImageOptions = {
    config: ResizeImageConfig[];
}

@injectable()

export default class ImageResizeService {
    processImage(data: Buffer, options: ResizeImageOptions): Promise<{ data: Buffer, info: OutputInfo }[]> {
        return Promise.all(options.config.map((config) => this.resizeImage(data, config)));
    }

    resizeImage(data: Buffer, config: ResizeImageConfig): Promise<{ data: Buffer, info: OutputInfo }> {
        return sharp(data).resize(config.width, config.height)
            .webp()
            .toBuffer({ resolveWithObject: true });
    }
}