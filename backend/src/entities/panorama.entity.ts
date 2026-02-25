import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('panoramas')
export class Panorama {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  forwardId: string;

  @Column({ nullable: true })
  leftId: string;

  @Column({ nullable: true })
  rightId: string;

  @Column({ nullable: true })
  backwardId: string;

  @Column({ type: 'float', default: 0 })
  yaw: number;

  @Column({ type: 'float', default: 0 })
  pitch: number;
}
