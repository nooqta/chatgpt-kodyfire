export declare const concept: {
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
export declare const chatgpt: {
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
export declare const conceptArray: {
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
export declare const chatgptArray: {
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
export declare const schema: {
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
        chatgpt: {
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
};
