class Example3 {
  state = {
    name: '',
    counter: 0,
    color: 'green',
    showColors: true
  };

  @useEffect()
  updatePageTitle ({ state }) {
    document.title = `You clicked ${state.count} times`
  }

  @computed()
  buttonStyle ({ style }) {
    return {
      background: state.color,
      color: 'white',
      border: `5px solid ${state.color}`
    }
  }

  toggleColorOptions = (e) => this.state.showColors = e.target.checked
  incrementClicks = () => this.state.count++
  updateName = (e) => this.state.name = e.target.value
  selectColor = (e) => this.state.color = e.target.value

  view () {
    return (
      <div>
        <label for="name">Your name</label>
        <br />
        <UxInput type="text" name="name" value={() => this.state.name} oninput={updateName} />
        <p> Hello { () => this.state.name || 'John Doe' }! You have clicked { () => this.state.count } time{ () => this.state.count !== 1 ? 's' : ''} on the {() => this.state.color} button. </p>
        <button style={buttonStyle} onclick={incrementClicks}> Increment! </button>
        <p>
          <label>
            <input type="checkbox" checked={() => this.state.showColors} oninput={ toggleColorOptions }/>
            Show color options
          </label>
        </p>
        <p>
          { $and(() => this.state.showColors,
            colors.map( color => <label>
              <input
                type="radio"
                value={color}
                checked={() => color === this.state.color ? 'checked' : null}
                name="color"
                id={color}
                onchange={selectColor}
              />
              { color }
            </label>
          ))}
        </p>
      </div>
    );
  }
}
