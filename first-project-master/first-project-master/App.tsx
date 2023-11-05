import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {
  eachDayOfInterval,
  format,
  getYear,
  getMonth,
  eachMonthOfInterval,
  eachYearOfInterval,
  isEqual,
  addMonths,
} from 'date-fns';

type styleForm = {
  height: number;
  width: number;
  marginVertical: number;
  marginHorizontal: number;
};
type Node = {
  id: string[];
  title: Date[];
};
//New data type (Objects in an array)
type newData = {
  id: string;
  title: string;
  name: string;
  empty: boolean;
};
type task = {
  id: string;
  title: Date;
  name: string;
};
//Each item to be rendered
const Item = ({
  item,
  onPress,
  backgroundColor,
  textColor,
  styleType,
}: {
  item: {id: string; name: string; title: string; empty: boolean};
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
  styleType: styleForm;
}) => (
  <TouchableOpacity onPress={onPress} style={[styleType, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
    <Text style={[styles.title, {color: textColor}]}>{item.name}</Text>
  </TouchableOpacity>
);
let tasks: task[] = [];
//The main part of the code that generates the flat list and renders it.
const MyList = () => {
  const [selectedId, setSelectedId] = useState('0');
  const parseToDay: Date[] = eachDayOfInterval({
    start: new Date(1999, 12, 1),
    end: new Date(2049, 11, 31),
  });
  const parseToMonth: Date[] = eachMonthOfInterval({
    start: new Date(2000, 0, 1),
    end: new Date(2049, 12, 0),
  });
  const parseToYear: Date[] = eachYearOfInterval({
    start: new Date(2000, 1, 1),
    end: new Date(2049, 12, 1),
  });
  //Creates the arrays according to the data type
  const createArrays = (type: string) => {
    const oldData: Node = {
      id: [],
      title: [],
    };
    if (type === 'years') {
      oldData.id = parseToYear.map(item => `${item}`);
      oldData.title = parseToYear;
    } else if (type === 'months') {
      oldData.id = parseToMonth.map(item => `${item}`);
      oldData.title = parseToMonth;
    } else {
      oldData.id = parseToDay.map(item => `${item}`);
      oldData.title = parseToDay;
    }
    let generatedArray: newData[] = Array(oldData.id.length);
    let i: number = 0;
    oldData.title.map(function (item: Date) {
      let converter: string;
      if (type === 'months') {
        converter = addMonths(oldData.title[i], 1).toLocaleString('en-US', {
          month: 'long',
        });
      } else if (type === 'years') {
        converter = format(item, 'yyyy');
      } else {
        converter = format(item, 'dd');
      }
      let taskName: string = '';
      if (type === 'years') {
        for (let j: number = 0; j < tasks.length; j++) {
          if (getYear(oldData.title[i]) === getYear(tasks[j].title)) {
            taskName = taskName.concat(tasks[j].name);
          }
        }
      } else if (type === 'months') {
        for (let j: number = 0; j < tasks.length; j++) {
          if (
            getMonth(item) === getMonth(tasks[j].title) &&
            getYear(item) === getYear(tasks[j].title)
          ) {
            taskName = taskName.concat(tasks[j].name);
          }
        }
      } else {
        for (let j: number = 0; j < tasks.length; j++) {
          if (isEqual(item, tasks[j].title)) {
            taskName = taskName.concat(tasks[j].name);
          }
        }
      }
      let isEmpty;
      isEmpty = taskName === '';
      generatedArray[i] = {
        id: item.toString(),
        title: converter,
        name: taskName,
        empty: isEmpty,
      };
      i++;
    });
    return generatedArray;
  };
  //State of the currently rendered data
  const [dataType, setDataType] = useState(createArrays('years'));
  const [text, onChangeText] = useState('');
  const [day, onChangeDay] = useState('');
  const [month, onChangeMonth] = useState('');
  const [loading, setLoading] = useState(false);
  function addTask(data: task): void {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    tasks = tasks.concat(data);
    if (dataType[0].title === format(parseToDay[0], 'yyyy')) {
      setDataType(createArrays('years'));
    } else if (dataType[0].title === 'January') {
      setDataType(createArrays('months'));
    } else {
      setDataType(createArrays('days'));
    }
    onChangeText('');
    onChangeDay('');
    onChangeMonth('');
  }
  //Switches the data type
  const HandleClick = () => {
    if (dataType[0].title === format(parseToDay[0], 'yyyy')) {
      setDataType(createArrays('months'));
      setSelectedId('0');
    } else if (dataType[0].title === 'January') {
      setDataType(createArrays('days'));
      setSelectedId('0');
    } else {
      Alert.alert('Cant get more details');
    }
  };
  //Renders the elements according to their data type
  const renderItem = ({
    item,
  }: {
    item: {id: string; name: string; title: string; empty: boolean};
  }) => {
    const backgroundColor = item.empty ? '#1e7730' : '#a20b0b';
    const color = item.id === selectedId ? 'white' : 'black';
    let style: styleForm;
    if (dataType[0].title === format(parseToDay[0], 'yyyy')) {
      style = styles.years;
    } else if (dataType[0].title === 'January') {
      style = styles.months;
    } else {
      style = styles.days;
    }
    if (item.id === selectedId) {
      if (dataType[0].title === format(parseToDay[0], 'yyyy')) {
        return (
          <SafeAreaView>
            <Item
              item={item}
              onPress={() => setSelectedId(item.id)}
              backgroundColor={backgroundColor}
              textColor={color}
              styleType={style}
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangeMonth}
              value={month}
              placeholder="Enter a month"
              keyboardType={'number-pad'}
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangeDay}
              value={day}
              placeholder="Enter a day"
              keyboardType={'number-pad'}
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder="Enter a Task"
            />
            {loading ? (
              <ActivityIndicator animating={loading} />
            ) : (
              <Button
                title={'Add task'}
                onPress={() => {
                  let newTask: task = {
                    id: '',
                    title: new Date(),
                    name: '',
                  };
                  const yearHolder = getYear(new Date(selectedId));
                  newTask.name = text + '\n';
                  newTask.title = new Date(yearHolder, +month - 1, +day);
                  newTask.id = newTask.title.toString();
                  addTask(newTask);
                }}
              />
            )}
          </SafeAreaView>
        );
      } else if (dataType[0].title === 'January') {
        return (
          <SafeAreaView>
            <Item
              item={item}
              onPress={() => setSelectedId(item.id)}
              backgroundColor={backgroundColor}
              textColor={color}
              styleType={style}
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangeDay}
              value={day}
              placeholder="Enter a day"
              keyboardType={'number-pad'}
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder="Enter a Task"
            />
            {loading ? (
              <ActivityIndicator animating={loading} />
            ) : (
              <Button
                title={'Add task'}
                onPress={() => {
                  let newTask: task = {
                    id: '',
                    title: new Date(),
                    name: '',
                  };
                  const yearHolder = getYear(new Date(selectedId));
                  const monthHolder = getMonth(new Date(selectedId));
                  newTask.name = text + '\n';
                  newTask.title = new Date(yearHolder, monthHolder, +day);
                  newTask.id = newTask.title.toString();
                  addTask(newTask);
                }}
              />
            )}
          </SafeAreaView>
        );
      } else {
        return (
          <SafeAreaView>
            <Item
              item={item}
              onPress={() => setSelectedId(item.id)}
              backgroundColor={backgroundColor}
              textColor={color}
              styleType={style}
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder="Enter a Task"
            />
            {loading ? (
              <ActivityIndicator animating={loading} />
            ) : (
              <Button
                title={'Add task'}
                onPress={() => {
                  let newTask: task = {
                    id: '',
                    title: new Date(),
                    name: '',
                  };
                  newTask.name = text + '\n';
                  newTask.id = selectedId;
                  newTask.title = new Date(selectedId);
                  addTask(newTask);
                }}
              />
            )}
          </SafeAreaView>
        );
      }
    } else {
      return (
        <Item
          item={item}
          onPress={() => setSelectedId(item.id)}
          backgroundColor={backgroundColor}
          textColor={color}
          styleType={style}
        />
      );
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        horizontal
        data={dataType}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
      <View style={styles.button}>
        <Button title={'More Details'} onPress={HandleClick} />
      </View>
      <View style={styles.space} />
      <View style={styles.button}>
        <Button
          title={'Clear'}
          onPress={() => setDataType(createArrays('years'))}
        />
      </View>
    </SafeAreaView>
  );
};
const App = () => {
  console.log('App running');
  return <MyList />;
};
//Style object
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  days: {
    height: 120,
    width: 120,
    marginVertical: 8,
    marginHorizontal: 2,
  },
  months: {
    height: 120,
    width: 200,
    marginVertical: 8,
    marginHorizontal: 2,
  },
  years: {
    height: 120,
    width: 410,
    marginVertical: 8,
    marginHorizontal: 2,
  },
  tasks: {
    height: 100,
    width: 120,
    marginVertical: 8,
    marginHorizontal: 2,
  },
  title: {
    fontSize: 22,
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  space: {
    width: 20,
    height: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
export default App;
