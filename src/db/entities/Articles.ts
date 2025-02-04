import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import EntityBase from 'src/common/classes/entity-base';
import { Users } from 'src/db';

@Entity(
    'articles',
    { schema: 'public' }
)
export default class Articles extends EntityBase {
    @Column('varchar')
    title: string;

    @Column('text')
    content: string;

    @Column('uuid', { name: 'created_by_id' })
    createdById: string;

    @ManyToOne(() => Users, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'created_by_id' })
    createdBy: Users | null;
}