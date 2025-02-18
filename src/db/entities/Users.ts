import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import EntityBase from 'src/common/classes/entity-base';
import { Files } from 'src/db';

export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user',
    AUTHOR = 'author',
}

@Entity('users', { schema: 'public' })

export default class Users extends EntityBase {
    @Column('character varying', { name: 'first_name', length: 20 })
    firstName: string;

    @Column('character varying', { name: 'last_name', length: 20 })
    lastName: string;

    @Column('character varying', { name: 'email' })
    email: string;

    @Column('character varying', { name: 'password', length: 255, select: false })
    password: string;

    @Column('character varying', { length: 255, select: false })
    salt: string;

    @Column('enum', { name: 'role', enum: UserRoles, default: UserRoles.USER })
    role: UserRoles;

    @Column('character varying', { length: 30, select: false, name: 'email_confirmation_token' })
    emailConfirmationToken: string;

    @Column('timestamp', { select: false, name: 'email_confirmed_at' })
    emailConfirmedAt: Date;

    @Column('uuid', { name: 'avatar_id', nullable: true })
    avatarId: string;

    @OneToOne(() => Files, (files) => files.user)
    @JoinColumn({ name: 'avatar_id', referencedColumnName: 'id' })
    avatar: Files;
}