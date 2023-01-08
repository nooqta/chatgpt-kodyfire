import { Kody as BaseKody } from 'basic-kodyfire';
import { Technology } from './technology';
export declare class Kody extends BaseKody {
    constructor(params: any, _schema?: {
        type: string;
        properties: {
            project: {
                type: string;
            };
            name: {
                type: string;
            };
            rootDir: {
                type: string;
            };
            concept: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        template: {
                            type: string;
                        };
                        outputDir: {
                            type: string;
                        };
                    };
                };
            };
            md: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        outputDir: {
                            type: string;
                        };
                    };
                    required: string[];
                };
            };
            text: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        outputDir: {
                            type: string;
                        };
                    };
                    required: string[];
                };
            };
        };
        required: string[];
    }, technology?: Technology);
}
