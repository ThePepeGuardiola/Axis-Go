import { StatusBar } from "expo-status-bar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from '@expo/vector-icons/AntDesign';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { StyleSheet, View, Text } from "react-native";





export default function App() {
    return(
      
        <View style={styles.container}>

               <StatusBar style="auto"/>

               <View style={styles.searchbar}>

               <AntDesign style={styles.left} name="left" size={23} color="black"/>
                 <View style={styles.search}>
                     <AntDesign name="search1" size={17} color="#A0A0A0"/>
                    <Text style={styles.textchbar}> Search </Text>
                 </View>
                     <SimpleLineIcons style={styles.bell} name="bell" size={20} color="black" />
               </View>
               
            <Text style={styles.title}>Favoritos</Text>
               <view style={styles.textcont}>

                <View style={styles.firstcont}>

                <FontAwesome name='star'  size={20} color='#900020'/>
                 < text style={styles.text1}>Supermercados</text> 
                 < text style={styles.subtext1}>Jumbo, AV. Luperon</text>
                 < text style={styles.sidetext1}>1.7 Km</text> 
                 </View>

                 
                 
                 <View style={styles.sectcont}> 
                  
                 <FontAwesome name='star'  size={20} color='#900020'/>
                 < text style={styles.text2}>Supermercados</text> 
                 < text style={styles.subtext2}>Jumbo, AV. Luperon</text>
                 < text style={styles.sidetext2}>1.7 Km</text> 
                 </View>

                 <View style={styles.thirdcont}>

                 <FontAwesome name='star'  size={20} color='#900020'/>
                 < text style={styles.text3}>Supermercados</text> 
                 < text style={styles.subtext3}>Jumbo, AV. Luperon</text>
                 < text style={styles.sidetext3}>1.7 Km</text> 
                 </View>

                 <View style={styles.fourthtcont}>

                 <FontAwesome name='star'  size={20} color='#900020'/>
                 < text style={styles.text4}>Supermercados</text>
                 < text style={styles.subtext4}>Jumbo, AV. Luperon</text>
                 < text style={styles.sidetext4}>1.7 Km</text>
                 </View>

                 <View style={styles.fifthcont}>

                 <FontAwesome name='star'  size={20} color='#900020'/>
                 < text style={styles.text5}>Supermercados</text>
                 < text style={styles.subtext5}>Jumbo, AV. Luperon</text>
                 < text style={styles.sidetext5}>1.7 Km</text>
                 </View>

                 <View style={styles.sixcont}>

                 <FontAwesome name='star'  size={20} color='#900020'/>
                 < text style={styles.text6}>Supermercados</text>
                 < text style={styles.subtext6}>Jumbo, AV. Luperon</text>
                 < text style={styles.sidetext6}>1.7 Km</text>
                 </View>

                 <View style={styles.sevencont}>

                 <FontAwesome name='star'  size={20} color='#900020'/>
                 < text style={styles.text7}>Supermercados</text>
                 < text style={styles.subtext7}>Jumbo, AV. Luperon</text>
                 < text style={styles.sidetext7}>1.7 Km</text>
                 </View>

                 <View style={styles.eightcont}>
              
                 <FontAwesome name='star'  size={20} color='#900020'/>
                 < text style={styles.text8}>Supermercados</text> 
                 < text style={styles.subtext8}>Jumbo, AV. Luperon</text>
                 < text style={styles.sidetext8}>1.7 Km</text>
                 </View>

                 <View style={styles.ninecont}>

                 <FontAwesome name='star'  size={20} color='#900020'/>
                 < text style={styles.text9}>Supermercados</text> 
                 < text style={styles.subtext9}>Jumbo, AV. Luperon</text>
                 < text style={styles.sidetext9}>1.7 Km</text> 
                 </View>

                 <View style={styles.tencont}>

                 <FontAwesome name='star'  size={20} color='#900020'/>
                 < text style={styles.text10}>Supermercados</text> 
                 < text style={styles.subtext10}>Jumbo, AV. Luperon</text>
                 < text style={styles.sidetext10}>1.7 Km</text> 
                 </View>

                
                

               </view>
               
        </View>
        
 );
}

const styles = StyleSheet.create({
  
  container: {
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#FFC1CF',
},

   searchbar: {
    backgroundColor: '#ffff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 55,
   },

   search: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    paddingRight: 180,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 50,
    marginRight: 50,
   },

   textchbar: {
    color: '#A0A0A0',
    fontSize: 16,
    paddingLeft: 5,
   },

   left: {
    top: 5,
   },

   bell: {
    top: 5,
    right: 5,
   },

   title: {
    paddingTop: 100,
    position: 'absolute',
    marginLeft: 15,
    fontSize: 30,
    color: '#3B3B3B',
},

   textcont: {
    position: 'relative',
    color: '#000000',
    marginTop: 57,
    paddingBottom: 50,
    marginLeft: 15,
},


// 1


firstcont: {
  paddingBottom: 20,
},

   text1: {
    position: 'absolute',
    fontSize: 20,
    paddingLeft: 50,
},

   subtext1:{
    paddingTop: 5,
    fontSize: 15,
    color: '#8F8F8F',
    paddingLeft: 50,
},

  sidetext1: {
    fontSize: 15,
    color: '#8F8F8F',
    position: 'absolute',
    marginTop: 26,
    marginLeft: 280,
  },

  // 2

  sectcont: {
    paddingBottom: 20,
  },
  
  text2: {
    position: 'absolute',
    fontSize: 20,
    paddingLeft: 50,
  },
  
  subtext2:{
    paddingTop: 5,
    fontSize: 15,
    color: '#8F8F8F',
    paddingLeft: 50,
  },
  
  sidetext2: {
    fontSize: 15,
    color: '#8F8F8F',
    position: 'absolute',
    marginTop: 26,
    marginLeft: 280,
  },

  // 3

  thirdcont: {
    paddingBottom: 20,
  },
  
  text3: {
    position: 'absolute',
    fontSize: 20,
    paddingLeft: 50,
  },
  
  subtext3:{
    paddingTop: 5,
    fontSize: 15,
    color: '#8F8F8F',
    paddingLeft: 50,
  },
  
  sidetext3: {
    fontSize: 15,
    color: '#8F8F8F',
    position: 'absolute',
    marginTop: 26,
    marginLeft: 280,
  },

  // 4

  fourthtcont: {
    paddingBottom: 20,
  },
  
  text4: {
    position: 'absolute',
    fontSize: 20,
    paddingLeft: 50,
  },
  
  subtext4:{
    paddingTop: 5,
    fontSize: 15,
    color: '#8F8F8F',
    paddingLeft: 50,
  },
  
  sidetext4: {
    fontSize: 15,
    color: '#8F8F8F',
    position: 'absolute',
    marginTop: 26,
    marginLeft: 280,
  },

  // 5

  fifthcont: {
    paddingBottom: 20,
  },
  
  text5: {
    position: 'absolute',
    fontSize: 20,
    paddingLeft: 50,
  },
  
  subtext5:{
    paddingTop: 5,
    fontSize: 15,
    color: '#8F8F8F',
    paddingLeft: 50,
  },
  
  sidetext5: {
    fontSize: 15,
    color: '#8F8F8F',
    position: 'absolute',
    marginTop: 26,
    marginLeft: 280,
  },

  // 6

  sixcont: {
    paddingBottom: 20,
  },
  
  text6: {
    position: 'absolute',
    fontSize: 20,
    paddingLeft: 50,
  },
  
  subtext6:{
    paddingTop: 5,
    fontSize: 15,
    color: '#8F8F8F',
    paddingLeft: 50,
  },
  
  sidetext6: {
    fontSize: 15,
    color: '#8F8F8F',
    position: 'absolute',
    marginTop: 26,
    marginLeft: 280,
  },

  // 7

  sevencont: {
    paddingBottom: 20,
  },
  
  text7: {
    position: 'absolute',
    fontSize: 20,
    paddingLeft: 50,
  },
  
  subtext7:{
    paddingTop: 5,
    fontSize: 15,
    color: '#8F8F8F',
    paddingLeft: 50,
  },
  
  sidetext7: {
    fontSize: 15,
    color: '#8F8F8F',
    position: 'absolute',
    marginTop: 26,
    marginLeft: 280,
  },

  // 8

  eightcont: {
    paddingBottom: 20,
  },
  
  text8: {
    position: 'absolute',
    fontSize: 20,
    paddingLeft: 50,
  },
  
  subtext8:{
    paddingTop: 5,
    fontSize: 15,
    color: '#8F8F8F',
    paddingLeft: 50,
  },
  
  sidetext8: {
    fontSize: 15,
    color: '#8F8F8F',
    position: 'absolute',
    marginTop: 26,
    marginLeft: 280,
  },

  // 9

  ninecont: {
    paddingBottom: 20,
  },
  
  text9: {
    position: 'absolute',
    fontSize: 20,
    paddingLeft: 50,
  },
  
  subtext9:{
    paddingTop: 5,
    fontSize: 15,
    color: '#8F8F8F',
    paddingLeft: 50,
  },
  
  sidetext9: {
    fontSize: 15,
    color: '#8F8F8F',
    position: 'absolute',
    marginTop: 26,
    marginLeft: 280,
  },

  // 10

  tencont: {
    paddingBottom: 20,
  },
  
  text10: {
    position: 'absolute',
    fontSize: 20,
    paddingLeft: 50,
  },
  
  subtext10:{
    paddingTop: 5,
    fontSize: 15,
    color: '#8F8F8F',
    paddingLeft: 50,
  },
  
  sidetext10: {
    fontSize: 15,
    color: '#8F8F8F',
    position: 'absolute',
    marginTop: 26,
    marginLeft: 280,
  },


});

