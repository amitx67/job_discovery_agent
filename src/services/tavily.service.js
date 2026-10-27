import {tavily} from "@tavily/core";



if (!process.env.TAVILY_API_KEY) {
    throw new Error("api key is missing from env file");
    
    
}

const tvly =tavily({
    apiKey: process.env.TAVILY_API_KEY
});

export async function searchJob (query, maxResults= 10) {
    if (!query || typeof query !== "string") {
        throw new Error("valid query is required");
        
        
    }
    const response = await tvly.search(query, {
        searchDepth: "basic",
        maxResults,
        topic: "general"
    });

    return response.results.map((result) => ({
        title: result.title,
        url: result.url,
        content: result.content,
        score: result.score

    }));

}

