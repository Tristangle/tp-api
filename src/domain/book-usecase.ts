import { DataSource } from "typeorm";
import { Collection} from "../database/entities/collection";

export interface ListBookFilter {
    limit: number
    page: number
    priceMin?: number
    tomeNumberMin?: number
    tomeNumberMax?: number
} 

export interface UpdateBookParams {
    tomeNumber?: number,
    review?: number
}

export class BookUsecase {

    constructor(private readonly db: DataSource) { }

    async listeBooks(listBookFilter: ListBookFilter): Promise<{ collection: Collection[]; totalCount: number; }> {
        console.log(listBookFilter)
        const query = this.db.createQueryBuilder(Collection, 'collection')
        query.skip((listBookFilter.page - 1) * listBookFilter.limit)
        query.take(listBookFilter.limit)
        
        if(listBookFilter.priceMin){
            query.andWhere('collection.price >= :priceMin', { priceMin: listBookFilter.priceMin })
        }
        if(listBookFilter.tomeNumberMin){
            query.andWhere('collection.tome >= :tomeNumberMin', { tomeNumberMin: listBookFilter.tomeNumberMin})
        }
        if(listBookFilter.tomeNumberMax){
            query.andWhere('collection.tome <= :priceMax', { tomeNumberMax: listBookFilter.tomeNumberMax })
        }
        const [collection, totalCount] = await query.getManyAndCount()
        return {
            collection,
            totalCount
        }
    }
    async updateBooks(id: number, { tomeNumber, review }: UpdateBookParams): Promise<Collection | null> {
        const repo = this.db.getRepository(Collection)
        const productfound = await repo.findOneBy({ id })
        if (productfound === null) return null

        if (tomeNumber) {
            productfound.tomeNumber = tomeNumber
        }

        const productUpdate = await repo.save(productfound)
        return productUpdate
    }

    

    
}