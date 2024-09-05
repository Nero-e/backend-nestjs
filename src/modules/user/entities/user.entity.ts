import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id_user' })
  public idUser: number;

  @Column({ name: 'name' })
  public name: string;

  @Column({ name: 'email' })
  public email: string;

  @Column({ name: 'role' })
  public role: boolean;

  @Column({ name: 'is_active' })
  public isActive: boolean;

  @Column({ name: 'is_deleted' })
  public isDeleted: boolean;

  @Column({ name: 'password' })
  public password?: string;
}
