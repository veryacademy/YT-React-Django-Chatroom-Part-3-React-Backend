import React, { useEffect, useMemo, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import { CssBaseline, Button, TextField, Link, Grid, Typography, Container, Card, CardHeader, Paper, Avatar } from '@mui/material';

interface Message {
  name: string,
  msg: string
}

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [value, setValue] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [room, setRoom] = useState<string>('vacad');

    //to not recreate every time the component rerendered
    const client = useMemo(() => {
        return new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/' + room + '/');
    }, [])

    const onButtonClicked = (e: any) => {
        client.send(JSON.stringify({
            type: 'message',
            message: value,
            name: name,
        }));
        setValue('');
        e.preventDefault();
    }

    useEffect(() => {
        client.onopen = () => {
            console.log("websocket client connected");
          }
          client.onmessage = (message: any) => {
            const dataFromServer = JSON.parse(message.data);
            console.log('got reply! from:', dataFromServer.name);
            if (dataFromServer) {
                setMessages((prev: Message[]) => [...prev,
                    {
                        msg: dataFromServer.message,
                        name: dataFromServer.name,
                    }
                ])
            }
          }
    }, [])

    return (
        <Container component='main' maxWidth='xs'>
            {isLoggedIn ? (
                <div style={{ marginTop: 50, }}>
                    Room Name: {room}
                    <Paper style={{ height: 500, maxHeight: 500, overflow: 'auto', boxShadow: 'none', }}>
                        {messages.map((message: Message, idx) => <div key={idx}>
                            <Card>
                                <CardHeader
                                    avatar={
                                    <Avatar>
                                        {message.name[0].toUpperCase()}
                                </Avatar>
                                    }
                                    title={message.name}
                                    subheader={message.msg}
                                />
                                </Card>
                        </div>)}
                    </Paper>

                <form noValidate onSubmit={onButtonClicked}>
                    <TextField
                        id="outlined-helperText"
                        label="Make a comment"
                        //defaultValue="Default Value"
                        variant="outlined"
                        value={value}
                        fullWidth
                        onChange={e => setValue(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Start Chatting
                    </Button>
                </form>
            </div>
            ) : (
            <div>
                <CssBaseline />
                <div>
                    <Typography component="h1" variant="h5">
                        ChattyRooms
                    </Typography>
                    <form noValidate onSubmit={value => setIsLoggedIn(true)}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Chatroom Name"
                            name="Chatroom Name"
                            autoFocus
                            value={room}
                            onChange={e => setRoom(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="Username"
                            label="Username"
                            type="Username"
                            id="Username"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Start Chatting
                        </Button>
                        <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                        </Grid>
                    </form>
                </div>
            </div>
            )}
        </Container>
    );
}

export default App;
