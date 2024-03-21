import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Collection{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    tomeNumber: number

    @Column()
    author: string

    @Column()
    price: number

    @Column()
    // Limiter le number à 5 à voir
    review: number

    constructor(id: number, name: string, tomeNumber: number, author: string, price: number, review: number){
        this.id = id;
        this.name = name;
        this.tomeNumber = tomeNumber;
        this.author = author;
        this.price = price;
        this.review = review;
    }
}