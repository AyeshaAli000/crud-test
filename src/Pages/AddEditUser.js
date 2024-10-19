import React, { useState, useEffect } from 'react';
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 
import { storage, db } from "../firebase";
import { useParams, useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

const initialState = {
    name: "",
    email: "",
    info: "",
    contact: ""
};

const AddEditUser = () => {
    const [data, setData] = useState(initialState);
    const { name, email, info, contact } = data;
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) getSingleUser();
    }, [id]);

    const getSingleUser = async () => {
        const docRef = doc(db, "users", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            setData({ ...snapshot.data() });
        }
    };

    useEffect(() => {
        const uploadFile = () => {
            const fileName = new Date().getTime() + file.name; // Generate unique name for file
            const storageRef = ref(storage, fileName); 
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on("state_changed", (snapshot) => {
                const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progressPercent);

                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            }, 
            (error) => {
                console.error(error); 
                setErrors({ upload: "File upload failed, please try again." });
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setData((prev) => ({ ...prev, img: downloadURL })); // Update data with image URL
                });
            });
        };

        if (file) {
            uploadFile(); 
        }
    }, [file]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let errors = {};
        if (!name) errors.name = "Name is required";
        if (!email) errors.email = "Email is required";
        if (!info) errors.info = "Information is required";
        if (!contact) errors.contact = "Contact is required";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = validate();
        if (Object.keys(errors).length) return setErrors(errors);

        setIsSubmit(true);
        try {
            if (!id) {
                await addDoc(collection(db, "users"), {
                    ...data,
                    timestamp: serverTimestamp()
                });
            } else {
                await updateDoc(doc(db, "users", id), {
                    ...data,
                    timestamp: serverTimestamp()
                });
            }
            navigate("/"); // Navigate after successful data submission
        } catch (error) {
            console.log(error);
            setIsSubmit(false); // Re-enable form if error occurs
        }
    };

    return (
        <div>
            <Grid centered verticalAlign='middle' columns="3" style={{ height: "80vh" }}>
                <Grid.Row>
                    <Grid.Column textAlign='center'>
                        <div>
                            {isSubmit ? (
                                <Loader active inline="centered" size="huge" />
                            ) : (
                                <>
                                    <h2>{id ? "Update User" : "Add User"}</h2>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Input 
                                            label="Name" 
                                            error={errors.name ? { content: errors.name } : null}
                                            placeholder="Enter Name" 
                                            name="name" 
                                            onChange={handleChange} 
                                            value={name}
                                            autoFocus
                                        />
                                        <Form.Input 
                                            label="Email" 
                                            error={errors.email ? { content: errors.email } : null}
                                            placeholder="Enter Email" 
                                            name="email" 
                                            onChange={handleChange} 
                                            value={email}
                                        />
                                        <Form.TextArea 
                                            label="Info" 
                                            error={errors.info ? { content: errors.info } : null}
                                            placeholder="Enter Information" 
                                            name="info" 
                                            onChange={handleChange} 
                                            value={info}
                                        />
                                        <Form.Input 
                                            label="Contact" 
                                            error={errors.contact ? { content: errors.contact } : null}
                                            placeholder="Enter Contact" 
                                            name="contact" 
                                            onChange={handleChange} 
                                            value={contact}
                                        />
                                        <Form.Input
                                            label="Upload"
                                            type='file'
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                        <Button primary type='submit' disabled={progress !== null && progress < 100}>
                                            Submit
                                        </Button>
                                        {progress && <div>Upload Progress: {Math.round(progress)}%</div>}
                                        {errors.upload && <div style={{ color: 'red' }}>{errors.upload}</div>}
                                    </Form>
                                </>
                            )}
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};

export default AddEditUser;
