// In App.js in a new project

import * as React from 'react';
import {
  Button,
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import axios from 'axios';
import Select, {SelectItem} from '@redmin_delishaj/react-native-select';
import {useState} from 'react';

const baseUrl = 'http://localhost:8082';
const baseUrl2 = 'http://localhost:8083';

const Stack = createNativeStackNavigator();

const orderByData: SelectItem[] = [
  {text: 'title', value: 'title'},
  {text: 'rating', value: 'rating'},
  {text: 'year', value: 'year'},
];

const directionData: SelectItem[] = [
  {text: 'asc', value: 'asc'},
  {text: 'desc', value: 'desc'},
];

const LogIn = ({navigation}, email, password) => {
  axios({
    method: 'post',
    url: `${baseUrl}/login`,
    data: {
      email,
      password,
    },
  })
    .then(response => {
      navigation.navigate('Search', {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      }),
        alert(JSON.stringify(response.data.result.message));
    })
    .catch(error => alert(JSON.stringify(error.response.data.result.message)));
};

const Register = ({navigation}, email, password) => {
  axios({
    method: 'post',
    url: `${baseUrl}/register`,
    data: {
      email,
      password,
    },
  })
    .then(response => {
      navigation.navigate('LogIn'),
        alert(JSON.stringify(response.data.result.message));
    })
    .catch(error => alert(JSON.stringify(error.response.data.result.message)));
};

function searchMovieId(id, accessToken) {
  return axios({
    method: 'get',
    url: `${baseUrl2}/movie/` + id,
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
}

function LogInScreen({navigation}) {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.titleText}>Log In</Text>
      <TextInput
        onChangeText={onChangeEmail}
        value={email}
        placeholder="email"
      />
      <TextInput
        secureTextEntry={true}
        onChangeText={onChangePassword}
        value={password}
        placeholder="password"
      />
      <Button
        title="LogIn"
        onPress={() =>
          /* 1. Navigate to the Details route with params */
          LogIn({navigation}, email, password)
        }
      />
      <Button
        title="Register"
        onPress={() =>
          /* 1. Navigate to the Details route with params */
          navigation.navigate('Register')
        }
      />
    </View>
  );
}

function RegisterScreen({navigation}) {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.titleText}>Register</Text>
      <TextInput
        onChangeText={onChangeEmail}
        value={email}
        placeholder="email"
      />
      <TextInput
        secureTextEntry={true}
        onChangeText={onChangePassword}
        value={password}
        placeholder="password"
      />
      <Button
        title="Register"
        onPress={() =>
          /* 1. Navigate to the Details route with params */
          Register({navigation}, email, password)
        }
      />
    </View>
  );
}

function SearchScreen({route, navigation}) {
  const [title, changeTitle] = React.useState('');
  const [year, changeYear] = React.useState('');
  const [director, changeDirector] = React.useState('');
  const [genre, changeGenre] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [previousPage, setPrev] = React.useState(1);

  const [orderBy, setOrderBy] = React.useState('title');
  const [direction, setDirection] = React.useState('asc');
  const {accessToken} = route.params;
  const [posts, setPosts] = useState([]);

  const checkPosts = response => {
    if (response.data.movies != null) {
      setPosts(response.data.movies);
    } else {
      alert('No results beyond this page');
      setPage(previousPage);
    }
  };

  const getPosts = page => {
    axios({
      method: 'get',
      url: `${baseUrl2}/movie/search`,
      params: {
        orderBy: orderBy,
        direction: direction,
        limit: 10,
        title: title,
        year: year,
        director: director,
        genre: genre,
        page: page,
      },
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    }).then(response => checkPosts(response));
  };

  const search = () => {
    setPage(1);
    getPosts(1);
  };

  const prevPage = () => {
    if (page > 1) {
      setPrev(page);
      setPage(page - 1);
      getPosts(page - 1);
    } else {
      alert('page cannot be < 1');
    }
  };

  const nextPage = () => {
    setPrev(page);
    setPage(page + 1);
    getPosts(page + 1);
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.titleText}>Search Screen</Text>
      <TextInput onChangeText={changeTitle} value={title} placeholder="title" />
      <TextInput onChangeText={changeYear} value={year} placeholder="year" />
      <TextInput
        onChangeText={changeDirector}
        value={director}
        placeholder="director"
      />
      <TextInput onChangeText={changeGenre} value={genre} placeholder="genre" />
      <View style={{flexDirection: 'row'}}>
        <Select
          width={180}
          placeholder={'orderBy'}
          data={orderByData}
          onSelect={value => setOrderBy(value)}
          value={orderBy}
        />
        <Select
          width={180}
          placeholder={'direction'}
          data={directionData}
          onSelect={value => setDirection(value)}
          value={direction}
        />
      </View>
      <Text>
        {'\n'}
        {'\n'}
        {'\n'}
        {'\n'}
        {'\n'}
        {'\n'}
        {'\n'}
        {'\n'}
        {'\n'}
      </Text>
      <Button
        title="Search"
        onPress={() =>
          /* 1. Navigate to the Details route with params */
          search()
        }
      />
      <FlatList
        data={posts}
        renderItem={({item}) => (
          <Text>
            {item.title} {'\n'}
            {item.director} {'\n'}
            {item.year} {'\n'}
            <Button
              title="Details"
              onPress={() =>
                navigation.navigate('Details', {
                  accessToken: accessToken,
                  movieId: item.id,
                })
              }
            />{' '}
            {'\n'}
            {'\n'}
          </Text>
        )}
      />
      <View style={{flexDirection: 'row'}}>
        <Button title="prev" onPress={() => prevPage()} />
        <Text>{page}</Text>
        <Button title="next" onPress={() => nextPage()} />
      </View>
    </View>
  );
}

function DetailScreen({route, navigation}) {
  const {accessToken, movieId} = route.params;
  const [movie, setMovie] = React.useState({});
  const [genres, setGenres] = React.useState([]);
  const [people, setPeople] = React.useState([]);

  React.useEffect(() => {
    searchMovieId(movieId, accessToken)
      .then(response => setMovie(response.data.movie))
      .catch(error => console.log(error));
  }, [accessToken, movieId, setMovie]);

  React.useEffect(() => {
    searchMovieId(movieId, accessToken)
      .then(response => setGenres(response.data.genres))
      .catch(error => console.log(error));
  }, [accessToken, movieId, setGenres]);

  React.useEffect(() => {
    searchMovieId(movieId, accessToken)
      .then(response => setPeople(response.data.persons))
      .catch(error => console.log(error));
  }, [accessToken, movieId, setPeople]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.titleText}>Movie Info</Text>
      <Text>Title: {movie.title}</Text>
      <Text>Release Year: {movie.year}</Text>
      <Text>Director: {movie.director}</Text>
      <Text>Rating: {movie.rating}</Text>
      <Text>Votes: {movie.numVotes}</Text>
      <Text>
        Overview: {movie.overview} {'\n'}
      </Text>
      <Text style={styles.titleText}>Genres</Text>
      <FlatList
        data={genres}
        renderItem={({item}) => (
          <Text>
            {item.name} {'\n'}
          </Text>
        )}
      />
      <Text style={styles.titleText}>{'\n'}People</Text>
      <FlatList
        data={people}
        renderItem={({item}) => (
          <Text>
            {item.name} {'\n'}
          </Text>
        )}
      />
    </View>
  );
}

function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LogIn">
          <Stack.Screen name="LogIn" component={LogInScreen} />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Details" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default App;
