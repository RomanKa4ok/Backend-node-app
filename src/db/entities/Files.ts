import { Column, Entity, OneToOne } from 'typeorm';
import EntityBase from 'src/common/classes/entity-base';
import { Users } from 'src/db';
import { TAny } from 'src/common/types';

export type ImageMetadata = {
    width: number;
    height: number;
}

type FileMeta = ImageMetadata | {
    [key: string]: TAny;
}

@Entity(
    'files',
    { schema: 'public' }
)
export default class Articles extends EntityBase {
    @Column('varchar', { length: 255 })
    name: string;

    @Column('varchar', { length: 255 })
    path: string;

    @Column('varchar', { length: 20 })
    type: string;

    @Column('uuid', { name: 'parent_id' })
    parentId: string | null;

    @Column('int')
    size: number;

    @OneToOne (() => Users, (users) => users.avatar)
    user: Users;

    @Column('json')
    meta: FileMeta;
}