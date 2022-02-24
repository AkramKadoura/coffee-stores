import { createApi } from 'unsplash-js'

const unsplashApi = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
    //...
})

const getCoffeeStorePhotos = async () => {

    const photos = await unsplashApi.search.getPhotos({
        query: 'coffee shops',
        perPage: 40
    });


    const unsplashResults = photos.response.results
    return unsplashResults.map(result => result.urls['small'])
}


const getCoffeeStoresUrl = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}


export const fetchCoffeeStores = async (latLong = '52.52162079961843,13.409541009993589', limit = 6) => {

    const photos = await getCoffeeStorePhotos()
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `${process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY}`
        }
    };

    const response = await fetch(getCoffeeStoresUrl(latLong, 'coffee', limit), options)
    const data = await response.json();

    return data.results.map((venue, idx) => {
        return {
            // ...venue,
            fsq_id: venue.fsq_id,
            name: venue.name,
            address: venue.location.address,
            neighborhood: venue.location.neighborhood || venue.location.cross_street || '',
            imgUrl: photos[idx]

        }
    })

}