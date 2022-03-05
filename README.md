#flipcard

React flip card component

## Installing

```bash
$ yarn install flipcard
```

## Example

```js
import React from 'react';
import FlipCard from 'flipcard';

class App extends React.Component {
  state = {
      isFlipped: false
  }
  
  showBack() {
    this.setState({
      isFlipped: true
    });
  }

  showFront() {
    this.setState({
      isFlipped: false
    });
  }
  
  handleKeyDown(e) {
    if (this.state.isFlipped && e.keyCode === 27) {
      this.showFront();
    }
  }

  render() {
    return (
      <div>
        {/* Default behavior is horizontal flip on hover, or focus */}
        <FlipCard>
          {/* The first child is used as the front of the card */}
          <div>
            <div>Front</div>
            <div><small>(horizontal flip)</small></div>
          </div>
          {/* The second child is used as the back of the card */}
          <div>Back</div>
        </FlipCard>

        {/* The `type` attribute allows using a vertical flip */}
        <FlipCard type="vertical">
          <div>
            <div>Front</div>
            <div><small>(vertical flip)</small></div>
          </div>
          <div>Back</div>
        </FlipCard>

        {/*
          The `disabled` attribute allows turning off the auto-flip
          on hover, or focus. This allows manual control over flipping.

          The `flipped` attribute indicates whether to show the front,
          or the back, with `true` meaning show the back.
        */}
        <FlipCard
          disabled={true}
          flipped={this.state.isFlipped}
          onFlip={()=>{
              console.log('on flip')
          }}
          onKeyDown={this.handleKeyDown}
        >
          <div>
            <div>Front</div>
            <button type="button" onClick={this.showBack}>Show back</button>
            <div><small>(manual flip)</small></div>
          </div>
          <div>
            <div>Back</div>
            <button type="button" onClick={this.showFront}>Show front</button>
          </div>
        </FlipCard>
      </div>
    );
  }
}

React.render(<App/>, document.getElementById('container'));
```

## License

MIT
