import {  Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn} from 'typeorm';

@Entity({ name: 'user' }) 
export class UserEntity {
    @ObjectIdColumn()
    id: ObjectId;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @CreateDateColumn({name:'created_at'})
  createdAt: Date;
}
