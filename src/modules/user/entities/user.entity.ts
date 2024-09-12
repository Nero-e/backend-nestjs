import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id_user' })
  public idUser: number;

  @Column({ name: 'name' })
  public name: string;

  @Column({ name: 'username' })
  public username: string;

  @Column({ name: 'email' })
  public email: string;

  @Column({ name: 'id_role' })
  public role: number;

  @Column({ name: 'is_active' })
  public isActive: boolean;

  @Column({ name: 'is_deleted' })
  public isDeleted: boolean;

  @Column({ name: 'password' })
  public password?: string;
}
