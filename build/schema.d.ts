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
export declare const md: {
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
export declare const text: {
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
export declare const tts: {
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
export declare const mdArray: {
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
export declare const textArray: {
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
export declare const ttsArray: {
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
        tts: {
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
