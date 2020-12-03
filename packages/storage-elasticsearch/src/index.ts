import { Client } from "@elastic/elasticsearch"
import { ICacheItem, IStorage } from "node-ts-cache"

export class ElasticSearchStorage implements IStorage {
    constructor(
        private indexName: string,
        private elasticsearchInstance: Client
    ) {}

    async clear(): Promise<void> {
        try {
            await this.elasticsearchInstance.indices.delete({
                index: this.indexName,
                ignore_unavailable: true
            })
        } catch (e) {
            return
        }
    }

    async getItem(key: string): Promise<ICacheItem | undefined> {
        let response

        try {
            response = await this.elasticsearchInstance.get({
                index: this.indexName,
                id: key
            })
        } catch (e) {
            return undefined
        }

        if (
            response.body === undefined ||
            response.body === null ||
            response.body._source === undefined ||
            response.body._source === null
        ) {
            return undefined
        }

        return response.body._source
    }

    async setItem(key: string, content: ICacheItem | undefined): Promise<void> {
        if (content === undefined) {
            try {
                await this.elasticsearchInstance.delete({
                    index: this.indexName,
                    id: key,
                    refresh: "wait_for"
                })
            } catch (e) {
                return
            }

            return
        }

        await this.elasticsearchInstance.index({
            index: this.indexName,
            id: key,
            refresh: "wait_for",
            body: content
        })
    }
}
