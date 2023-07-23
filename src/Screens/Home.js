//import liraries

import 'react-native-get-random-values';
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { GPT_KEY } from "@env"
import { v4 as uuidv4 } from 'uuid';

// create a component
const Home = () => {

    const [messages, setMessages] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        myPrompt('hey')
    }, [])


    const myPrompt = (text) => {
        const url = 'https://api.openai.com/v1/chat/completions'
        const config = {
            headers: {
                Authorization: `Bearer ${GPT_KEY}`
            }
        }
        const data = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "Your helping assistant. give answer in short way."
                },
                {
                    "role": "user",
                    "content": `${text}`
                }
            ],
            "temperature": 0.7,
            "stream": false
        }
        setLoading(true)
        axios.post(url, data, config).then((res) => {
            let result = res.data.choices[0]['message']['content']
            console.log("res++++", result)

            let my_value = [
                {
                    _id: uuidv4(),
                    text: result,
                    createdAt: new Date(),
                    user: {
                        _id: 1,
                        name: 'system',
                        avatar: require('../assets/chatgpt.jpeg'),
                    },
                },
            ]

            setMessages(previousMessages =>
                GiftedChat.append(previousMessages, my_value),
            )
            setLoading(false)
        }).catch((error) => {
            console.log("error raised", error)
            alert(error?.response?.data?.error?.message)
            setLoading(false)
        })

    }

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )
        myPrompt(messages[0]?.text)
    }, [])

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <GiftedChat
                    isTyping={isLoading}
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    showUserAvatar
                    user={{
                        _id: 2,
                        avatar: require('../assets/user.png'),
                        name: 'user'
                    }}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});


export default Home;
