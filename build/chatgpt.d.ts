import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept as BaseConcept } from 'basic-kodyfire';
export declare class Chatgpt extends BaseConcept {
    extension: string;
    params: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    generate(_data: any): Promise<void>;
    resolveTemplateName(templateName: string, name: string): string;
    getFilename(data: any): any;
    getExtension(templateName: string): string;
    getTemplatesPath(): string;
}
