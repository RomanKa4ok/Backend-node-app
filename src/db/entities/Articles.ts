import { Column, Entity } from 'typeorm';
import EntityBase from 'src/common/classes/entity-base';

@Entity(
    'articles',
    { schema: 'public' }
)
export default class Articles extends EntityBase {
    @Column('varchar')
    title: string;

    @Column('text')
    content: string;
} 