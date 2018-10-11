import React from 'react';
import Select from 'react-styled-select';
import './App.css';

class PredicateBuilder extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      predicates: [
        {
          sessionField: '',
          sessionFieldType: '',
          operator: '',
          value: '',
          rangeValue1: '',
          rangeValue2: ''
        }
      ],
      sessionFieldOptions: [
        { value: 'user_email', label: 'User Email', type: 'text' },
        { value: 'screen_width', label: 'Screen Width', type: 'number' },
        { value: 'screen_height', label: 'Screen Height', type: 'number' }, 
        { value: 'visits', label: '# of Visits', type: 'number' },
        { value: 'user_first_name', label: 'First Name', type: 'text' },
        { value: 'user_last_name', label: 'Last Name', type: 'text' },
        { value: 'page_response', label: 'Page Response Time (ms)', type: 'number' },
        { value: 'domain', label: 'Domain', type: 'text' }, 
        { value: 'path', label: 'Page Path', type: 'text' }
      ],
      operationsListOptions: [
        { value: 'text_starts_with', label: 'starts with', type: 'text'},
        { value: 'text_equals', label: 'equals', type: 'text'},
        { value: 'text_contains', label: 'contains', type: 'text'},
        { value: 'text_in_list', label: 'in list', type: 'text'}
      ], 
      operationsListOptionsForText: [
        { value: 'text_starts_with', label: 'starts with', type: 'text'},
        { value: 'text_equals', label: 'equals', type: 'text'},
        { value: 'text_contains', label: 'contains', type: 'text'},
        { value: 'text_in_list', label: 'in list', type: 'text'}
      ], 
      operationsListOptionsForNumbers: [
        { value: 'number_range', label: 'between', type: 'number'},
        { value: 'number_less_than_or_equal', label: 'less than or equal', type: 'number'},
        { value: 'number_equals', label: 'equals', type: 'number'},
        { value: 'number_greater_than_or_equal', label: 'greater than or equal', type: 'number'},
        { value: 'number_in_list', label: 'in list', type: 'text'},
      ]
    }
  }

  handleAddPredicate = () => {
    this.setState({
      predicates: this.state.predicates.concat([{ sessionField: '', sessionFieldType: '', operator: '', value: '', rangeValue1: '', rangeValue2: '' }])
      
    });
  }

  handleRemovePredicate = (idx) => () => {
    this.setState({
      predicates: this.state.predicates.filter((s, sidx) => idx !== sidx)
    });
  }

  handleSessionFieldsChange = (idx, fieldType) => (e) => {
    const newPredicates = this.state.predicates.map((predicates, sidx) => {
      if (idx !== sidx) return predicates
      return { ...predicates, sessionField: e, sessionFieldType: this.state.sessionFieldOptions.filter(x => x.value === e)[0].type, operator: '', value: '', rangeValue1: '', rangeValue2: '' }
    })
    this.setState({ predicates: newPredicates })
  }

  handleOperationsListChange = (idx) => (e) => {
    const newPredicates = this.state.predicates.map((predicates, sidx) => {
      if (idx !== sidx) return predicates
      return { ...predicates, operator: e, value: '', rangeValue1: '', rangeValue2: '' }
    })
    this.setState({ predicates: newPredicates })
  }

  handleValueInputChange = (idx) => (e) => {
    const newPredicates = this.state.predicates.map((predicates, sidx) => {
      if (idx !== sidx) return predicates
      return { ...predicates, value: e.target.value }
    })
    this.setState({ predicates: newPredicates })
  }

  handleRangeValue1InputChange = (idx) => (e) => {
    const newPredicates = this.state.predicates.map((predicates, sidx) => {
      if (idx !== sidx) return predicates
      return { ...predicates, rangeValue1: e.target.value }
    })
    this.setState({ predicates: newPredicates })
  }

  handleRangeValue2InputChange = (idx) => (e) => {
        const newPredicates = this.state.predicates.map((predicates, sidx) => {
      if (idx !== sidx) return predicates
      return { ...predicates, rangeValue2: e.target.value }
    })
    this.setState({ predicates: newPredicates })
  }

  handleSubmit = (e) => {
    fetch('http://localhost:3001/buildquery', {
      method: "POST",
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(this.state)
    })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      alert(`${result}`);
    })
    .catch(error => {
      return error;
    })
    e.preventDefault();   
  }

  render() {
    return (
      <div className="container">
        <h4>SEARCH FOR SESSIONS</h4>
        <hr />
        <form onSubmit={this.handleSubmit}  >

          {this.state.predicates.map((predicate, idx) => (
            <div className="predicate" key={idx}>
              <button 
                type="button" 
                onClick={this.handleRemovePredicate(idx)} 
                className="small" 
                disabled={(this.state.predicates.length===1)}>-</button>
              <Select 
                className='react-select-container'
                classNamePrefix='react-select'
                title={'SessionFields'}
                name={'SessionFields'}
                value={predicate.sessionField}
                options={this.state.sessionFieldOptions}
                onChange={this.handleSessionFieldsChange(idx)}
                searchable={false}
              />
              {(predicate.operator==='number_range') ?  
                <button disabled={true}>is</button> : null
              }
              <Select 
                className='react-select-container'
                classNamePrefix='react-select'
                title={'operationsList'}
                name={'operationsList'}
                value={predicate.operator}
                options={ (predicate.sessionFieldType==='number') ? this.state.operationsListOptionsForNumbers : this.state.operationsListOptionsForText } 
                onChange={this.handleOperationsListChange(idx)}
                searchable={false}
              />
              {(predicate.operator==='number_range') ? null : 
                <input 
                  label='value'
                  className={ ( (predicate.sessionFieldType==='number' && !predicate.operator==='number_in_list' && isNaN(predicate.value)) || (predicate.sessionFieldType==='number' && predicate.operator==='number_in_list' && isNaN(predicate.value.split(",").join("")))) ? "error" : "" }
                  value={predicate.value}
                  onChange={this.handleValueInputChange(idx)}
                />
              }
              {(predicate.operator==='number_range') ?  
                <input 
                  label='rangeValue1'
                  className={ (predicate.sessionFieldType==='number' && isNaN(predicate.rangeValue1)) ? "error" : "" }
                  source={predicate.rangeValue1}
                  onChange={this.handleRangeValue1InputChange(idx)}
                /> : null 
              }
              {(predicate.operator==='number_range') ?  
                <button disabled={true}>and</button> : null
              }
              {(predicate.operator==='number_range') ?  
                <input 
                  label="rangeValue2"
                  className={ (predicate.sessionFieldType==='number' && isNaN(predicate.rangeValue2)) ? "error" : "" }
                  source={predicate.rangeValue2}
                  onChange={this.handleRangeValue2InputChange(idx)}
                /> : null
              }
            </div>
        ))}
        <button type="button" onClick={this.handleAddPredicate} className="add-button">Add</button>
        <div className="search-button">
          
          <button
            className="search-button"
            color="#841584">
            Search
          </button>

        </div>
        </form>
      </div>
    ) 
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <PredicateBuilder />
      </div>
    );
  }
}

export default App;