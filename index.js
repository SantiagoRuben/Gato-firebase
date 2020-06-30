import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import app from './firebasedb'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props){
    super(props);
    this.db = app.firestore();
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      ban: 0
    };
  }

   onCollectionUpdate = querySnapshot => {
    let  squares = Array(9).fill(null);
    let i=0;
    querySnapshot.forEach(doc => {
      const {status,xIsNext} = doc.data();
      if(i!==9){
          squares[i] = status;
          i++;
        }else{
          this.setState({
           xIsNext
          })
        }
    });
      console.log(squares);
    this.setState({
      squares
    });
  };

componentDidMount(){
  if(this.state.ban===0){//limpiar la base de datos para un nuevo juego 
    for(let i=0; i < 10; i++){
      if(i!==9){
        this.db.collection('gato').doc(i.toString()).set({ 
            status: null
          });
      }else{
        this.db.collection('gato').doc(i.toString()).set({ 
            xIsNext: true
          });
      }
    }
    this.setState({
      ban: 1
    })
  }

    this.unsubscribe = this.db.collection('gato').onSnapshot(this.onCollectionUpdate);
  }

 componentWillUnmount() {
    this.unsubscribe();
  }

  handleClick(i){
    const squares = this.state.squares.slice();
    if(ganador(squares) || squares[i]){
      return;
    }
    this.db.collection('gato').doc(i.toString()).update({ // actualiza el cuadro en la base de datos
      status: this.state.xIsNext ? 'X' : 'O'
    });

    this.db.collection('gato').doc('9').update({  //actualiza el turno en la base de datos
      xIsNext: !this.state.xIsNext 
    })
  }

  renderSquare(i) {
    return <Square  
    value={this.state.squares[i]}
    onClick={()=> this.handleClick(i)}/>;
  }

  render() {
    const winner = ganador(this.state.squares);
    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }else{
      status = 'Next player: ' + (this.state.xIsNext? 'X':'O');
    }
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function ganador(squares){
  const lines=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for (let i=0;i<lines.length;i++){
    const [a,b,c]=lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] ===squares[c]){
      return squares[a];
    }
  }
  return null;
}