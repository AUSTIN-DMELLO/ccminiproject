async function getRecommendations() {
    const genre = document.getElementById("genre").value;
    const response = await fetch("movies.json");
    const movies = await response.json();
    
    // Filter movies by genre
    const filteredMovies = movies.filter(movie => movie.genre === genre);
    
    // Call Azure Cognitive Services Text Analytics (mocked for now)
    const sentiments = await analyzeSentiment(filteredMovies);
    
    // Filter positive sentiment movies
    const recommendations = filteredMovies.filter((movie, i) => sentiments[i].sentiment === "positive");
    
    // Display recommendations
    displayRecommendations(recommendations);
    
    // Save user preference to Azure Table Storage (mocked for now)
    savePreference(genre);
}

async function analyzeSentiment(movies) {
    const response = await fetch("https://ccminiproject.cognitiveservices.azure.com/text/analytics/v3.0/sentiment", {
        method: "POST",
        headers: {
            "Ocp-Apim-Subscription-Key": "35fNVXMeyagmcL0tFj8PUVeGXrbsAEw8nmsYjafYbNQpsS2rLNiiJQQJ99BDACYeBjFXJ3w3AAAaACOGGdKv",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            documents: movies.map(m => ({ id: m.id, text: m.description }))
        })
    });
    const data = await response.json();
    return data.documents;
}

async function savePreference(genre) {
    // Mock Table Storage call (replace with actual Azure SDK call)
    console.log(`Saving preference: ${genre}`);
    /*
    const tableClient = new TableClient("your_storage_connection_string", "Preferences");
    await tableClient.createEntity({
        partitionKey: "UserPrefs",
        rowKey: Date.now().toString(),
        genre: genre
    });
    */
}

function displayRecommendations(movies) {
    const list = document.getElementById("recommendations");
    list.innerHTML = movies.length > 0
        ? movies.map(m => `<li>${m.title}: ${m.description}</li>`).join("")
        : "<p>No positive recommendations found.</p>";
}