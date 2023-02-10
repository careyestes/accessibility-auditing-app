{{
  const RenderItem = (props) => {
    return(
      <ul id="todo">
      {props.items.map((item,i) => 
        <li className='list-group-item' data-id={item.id} key={i}>{item.name}
        <button className="btn btn-sm btn-primary" onClick={() => props.remove(item.id)}>X</button>
        </li>
      )}
      </ul>
    ) 
  };

  const TodoItems = React.createClass({
    getInitialState() {
      return {
        items: [
          {id:1,name:"Gym"},
          {id:2,name:"Jump"},
          {id:3,name:"Racing"}
        ],
        editing: false
      }
    },
    edit(){
      this.setState({editing: true})
    },
    save(){
      this.setState({editing: false})
    },
    remove(id){
    this.setState({
      items: this.state.items.filter((el) => id !== el.id)
    })
      //return this.items.filter((item,i) => item.id !== id)
    },
    render(){
      return(
        <RenderItem items={this.state.items} remove={this.remove}/>
      ) 
    }
  })


  ReactDOM.render(
    <TodoItems />,
    document.getElementById('container')
  );

}}