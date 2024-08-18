'use client'; 

import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Container,
    Grid,
    Typography,
    Card,
    CardActionArea,
    CardContent
} from '@mui/material';

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;
            const colRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = [];
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
            });
            console.log(flashcards); 
            setFlashcards(flashcards);
        }
        getFlashcard();
    }, [search, user]);

    const handleCardClick = (id) => {
        console.log("I am clicked ", id);
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <Container maxWidth="md">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                                <CardContent>
                                    <Box sx={{ 
                                            perspective: '1000px',
                                            '& > div': {
                                                position: 'relative',
                                                width: '100%',
                                                height: '200px',
                                                transformStyle: 'preserve-3d',
                                                transition: 'transform 0.6s',
                                                transform: flipped[flashcard.id]
                                                    ? 'rotateY(180deg)'
                                                    : 'rotateY(0deg)',
                                            },
                                        }}>
                                        <div sx={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' }}>
                                            <Typography variant="h5" component="div">
                                                {flashcard.front}
                                            </Typography>
                                        </div>
                                        <div sx={{ 
                                            position: 'absolute', 
                                            width: '100%', 
                                            height: '100%', 
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 2,
                                            boxSizing: 'border-box',
                                        }}>
                                            <Typography variant="h5" component="div">
                                                {flashcard.back}
                                            </Typography>
                                        </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
