import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {EntityStatus} from "src/common/constants";

@Entity('articles', {schema: 'public'})
export default class Articles {
    @PrimaryColumn('uuid')
    id: string;

    @Column('varchar')
    title: string;

    @Column('text')
    content: string;

    @Column({ type: 'enum', name: 'entity_status', default: EntityStatus.Draft, enum: EntityStatus })
    entityStatus: EntityStatus;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}