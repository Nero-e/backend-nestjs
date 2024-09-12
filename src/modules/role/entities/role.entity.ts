import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_role' })
  idRole: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description' })
  description: string;
}
