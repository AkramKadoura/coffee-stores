import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../styles/coffee-store.module.css'
import cls from 'classnames'

import { fetchCoffeeStores } from '../../lib/coffee-stores'
import { isEmpty } from '../../utils'
import { StoreContext } from '../../store/store-context'
import useSWR from 'swr';


export async function getStaticProps(staticProps) {
    const params = staticProps.params

    const coffeeStores = await fetchCoffeeStores();
    const findCoffeeStoreById = coffeeStores.find(coffeeStore => {
        return coffeeStore.fsq_id.toString() === params.id
    })

    return {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}

        }
    }
}

export async function getStaticPaths() {

    const coffeeStores = await fetchCoffeeStores();

    const paths = coffeeStores.map(coffeeStore => {
        return {
            params: {
                id: coffeeStore.fsq_id.toString()
            }
        }
    })

    return {
        paths: paths,
        fallback: true
    }
}


const CoffeeStore = (initialProps) => {

    const router = useRouter()

    if (router.isFallback) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    const id = router.query.id

    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore)

    const {
        state: {
            coffeeStores
        },
    } = useContext(StoreContext)

    const handleCreateCoffeeStore = async (coffeeStore) => {
        try {
            const { fsq_id, name, address, neighborhood, imgUrl } = coffeeStore;
            const response = await fetch("/api/createCoffeeStore", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    name,
                    likes: 0,
                    imgUrl,
                    neighborhood: neighborhood || "",
                    address: address || "",
                }),
            });

            const dbCoffeeStore = await response.json();
        } catch (err) {
            console.error("Error creating coffee store", err);
        }
    };

    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore)) {
            if (coffeeStores.length > 0) {
                const coffeeStoreFromContext = coffeeStores.find(coffeeStore => {
                    return coffeeStore.fsq_id.toString() === id
                });

                if (coffeeStoreFromContext) {
                    setCoffeeStore(coffeeStoreFromContext);
                    handleCreateCoffeeStore(coffeeStoreFromContext);
                }

            }
        } else {
            handleCreateCoffeeStore(initialProps.coffeeStore)
        }
    }, [id, initialProps, initialProps.coffeeStore])

    // const { name, location, imgUrl } = props.coffeeStore
    const { name, address, neighborhood, imgUrl } = coffeeStore

    const [likesCount, setLikesCount] = useState(0);

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

    useEffect(() => {
        if (data && data.length > 0) {
            setCoffeeStore(data[0]);
            setLikesCount(data[0].likes);
        }
    }, [data])

    const handleLikeButton = async () => {

        try {
            // const { fsq_id } = coffeeStore;
            const response = await fetch("/api/favouriteCoffeeStoreById", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                }),
            });

            const dbCoffeeStore = await response.json();

            if (dbCoffeeStore && dbCoffeeStore.length > 0) {
                let count = likesCount + 1;
                setLikesCount(count);
            }
        } catch (err) {
            console.error("Error liking coffee store", err);
        }
    }

    if (error) {
        return <div>Something went wrong! Retrieving coffee store page.</div>;
    }

    return (
        <div className={styles.layout}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/"><a>← Go to Home</a></Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <h1 className={styles.name}>{name}</h1>
                    </div>
                    <Image src={imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"} width={600} height={360} className={styles.storeImg} alt={name} />
                </div>
                <div className={cls('glass', styles.col2)}>
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/location.svg" width="24" height="24" />
                        <p className={styles.text}>{address}</p>
                    </div>
                    {neighborhood && <div className={styles.iconWrapper}>
                        <Image src="/static/icons/map.svg" width="24" height="24" />
                        <p className={styles.text}>{neighborhood}</p>
                    </div>}
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/thumbs_up.svg" width="24" height="24" />
                        <p className={styles.text}>{likesCount}</p>
                    </div>
                    <button className={styles.likeButton} onClick={handleLikeButton}>
                        Like!
                    </button>
                </div>
            </div>
        </div >
    )
}

export default CoffeeStore