import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { EntityStatus } from '../constants';

export default abstract class EntityBase {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'enum', name: 'entity_status', default: EntityStatus.Active, enum: EntityStatus })
    entityStatus: EntityStatus;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        name: 'updated_at',
    })
    updatedAt: Date;
}