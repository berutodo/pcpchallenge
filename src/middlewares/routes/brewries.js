const fetchData = async() => {
    const response = await fetch("https://api.openbrewerydb.org/breweries");
    const data = await response.json();
    return data;
};

export const brewriesRoute = async(request, reply) => {
    try {
        const data = await fetchData();
        reply.send({ msg: data });
    } catch (error) {
        console.error('Error fetching breweries:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
};