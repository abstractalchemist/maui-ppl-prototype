import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { listPeople } from "./graphql/queries";

function Listings() {

  const [listings, setListings] = useState([]);

  useEffect(() => {
    (async () => {
      const listingsData = await API.graphql({ query: listPeople });
      setListings(listingsData.data.listPeople.items);
    })();
  }, []);


  return <div>Listings</div>;
}

export default Listings;