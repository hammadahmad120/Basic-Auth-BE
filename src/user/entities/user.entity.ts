import {  Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn} from 'typeorm';

@Entity() 
export class User {
    @ObjectIdColumn()
    id: ObjectId;

@Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;
}