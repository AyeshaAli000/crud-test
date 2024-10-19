import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { Button, Card, Grid, Loader, Image } from "semantic-ui-react";
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, onSnapshot ,doc} from 'firebase/firestore';
import ModalComp from '../Components/ModalComp';


const Home = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);  // Boolean, not an array
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });  // Corrected typo
      });
      setUsers(list);
      setLoading(false);
    } , (error) => {
      console.log(error);
    }
  );
  

    return () => unsub();  // Clean up on unmount
  }, []);  // Dependency array to ensure useEffect runs only once

  if (loading) {
    return <Loader active inline="centered" size="large" />;
  }
  const handleModal=(item) => {
    setOpen (true);
    setUser(item);
  }
  const handleDelete = async (id) =>{
  if(window.confirm ("Are you sure to delete that user ?")){
    try{
      setOpen(false);
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user)=> user.id !== id));
    } catch(err){
      console.log(err);
    }
  }
  }
  return (
    <container>
      <Card.Group>
        <Grid columns={3}stackable style={{
                  alignItems : "Center",
                  marginLeft: "30px"
                }}>
          {users && users.map((item)=>
          <Grid.Column>
            <Card key={item.id}>
              <Card.Content>
                <Image
                src={item.img}
                size="medium"
                style={{
                  height: "150px",
                  width: "150px",
                  borderRadius: "50%"
                }}
                >
                </Image>
                <Card.Header
                style = {{marginTop: "10px"}}
                >
                </Card.Header>
                <Card.Description>{item.info}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div>
                  <Button color="purple"
                  // onClick={() => navigate('/update/${item.id}')}>
                     onClick={() => navigate(`/update/${item.id}`)}>
                    Update
                  </Button>
                  <Button color="grey"
                  onClick={() => handleModal(item)}
                  >
                    View
                  </Button>
                  {open && (
                    <ModalComp
                    open = {open}
                    setOpen= {setOpen}
                    handleDelete={handleDelete}
                    {...user} />
                  )}
                </div>
              </Card.Content>
            </Card>
          </Grid.Column>
          )}
        </Grid>
      </Card.Group>
    </container> // Correct return statement with parentheses
  );
};

export default Home;
