import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import axios from 'axios';
import TranslateIcon from '@mui/icons-material/Translate';
import IconButton from '@mui/material/IconButton';
import { Container } from '@mui/material';



const Translator = () => {
    // const classes = this.props;
    // const [classes,setClasses] = useState(this.props);
    const [language, setLanguage] = useState('en');
    const [inputText, setInputText] = useState('');
    const [languagesList, setLanguagesList] = useState([]);
    const [detectLanguageKey, setdetectedLanguageKey] = useState('en');
    const [resultText, setResultText] = useState('');
    const textToTranslate = useRef(null)

    const styles = theme => ({
        multilineColor:{
            color:'red'
        }
    });

    const handleChange = (event) => {
        const selectedLanguage=event.target.value;
        setLanguage(selectedLanguage);
      };

      const getLanguageSource = () => {
        if(inputText.trim()===''){
            alert('Please Enter Text TO Translate');
            return null;
        }
        axios.post(`https://libretranslate.de/detect`, {
            q: inputText
        })
        .then((response) => {
            setdetectedLanguageKey(response.data[0].language)
            
        })
      
    }

    useEffect(() => {
        
        axios.get(`https://libretranslate.de/languages`)
            .then((response) => {
                setLanguagesList(response.data)
            })
    }, [])

    const translateText = () => {
        getLanguageSource();
        if(inputText.trim()===''){
            return null;
        }
         let data = {
             q : inputText,
             source: detectLanguageKey,
             target: language
         }
         console.log("calling api");
         axios.post(`https://libretranslate.de/translate`, data)
         .then((response) => {
             setResultText(response.data.translatedText)
         })
     }

  return (
    <div>
          
            <div className='app-body'>
            
                <div>
                    <Container
                    className='container'
                      component="form"
                      noValidate
                      autoComplete="off"
                       
                    >
                    <div className="app-header">
                        <h2 className="header">My Text Translator</h2>
                    </div>      
                    <FormControl className='input-container'>

                        <TextField
                            required
                            ref={textToTranslate}
                            id="outlined-required"
                            label="Text To Translate"
                            variant='outlined'
                            
                            placeholder='Type Text To Translate'                     
                            onChange={(e) => setInputText(e.target.value)}
                            className='text-to-translate'
                        />
                    </FormControl>
                    <FormControl className='input-container'>
                        <InputLabel id="demo-simple-select-label">Language</InputLabel>
                        <Select
                        labelId="select-language"
                        id="language-select"
                        label="Language"
                        placeholder='Select Language'
                        value={language}
                        onChange={handleChange}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                        >
                                {
                                    languagesList.map((language)=>{
                                        return(
                                            <MenuItem key={language.code} value={language.code}>{language.name}</MenuItem>
                                        )
                                    })
                                }
                        </Select>
                    </FormControl>

                    <FormControl className='input-container'>

                        <TextField
                            required
                            className='translated-text'
                            id="outlined-required"
                            label="Translated Text"
                            placeholder='Translated Text'
                            value={resultText}
                        />
                    </FormControl>

                    <FormControl className='input-container' >
                    <Button variant="contained" color="success" size="large" 
                        onClick={translateText}
                        className="translate-btn"
                    >
                       <TranslateIcon />  &nbsp; Translate
                    </Button>
                    </FormControl>
                    {/* <FormControl sx={{ m: 1, minWidth: 860, }}>
                    <IconButton aria-label="Translate" onClick={translateText} color="success" variant="contained">
                        <TranslateIcon />
                    </IconButton>
                    </FormControl> */}

                    </Container>           
                </div>
            </div>
    </div>
  )
}

export default Translator