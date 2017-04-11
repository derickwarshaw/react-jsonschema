import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, set } from 'lodash';
import SchemaField from './SchemaField';
import { getDefaultState } from '../utils';
import { addValueToState, deleteIndexFromState } from '../reducers';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // Set the initial state
    this.setState({
      formData: getDefaultState(this.props.schema, this.props.formData),
    });
  }

  /**
   * Adds a new item
   *
   * @param {Object} e
   * @param {String} e.path
   * @param {Object} e.schema
   */
  handleAddItem(e) {
    const newState = addValueToState(this.state, {
      path: e.path,
      schema: e.schema,
    });
    this.setState(newState);
  }

  /**
   * Deletes an existing item
   *
   * @param {Object} e
   * @param {Number} e.index
   * @param {String} e.path
   */
  handleDeleteItem(e) {
    const newState = deleteIndexFromState(this.state, {
      index: e.index,
      path: e.path,
    });
    this.setState(newState);
  }

  /**
   * Handles a field change
   *
   * @param {Object} e
   * @param {String} e.path
   * @param {String|Number|Boolean} e.value
   */
  handleFieldChange(e) {
    const newState = cloneDeep(this.state);
    set(newState, e.path, e.value);
    this.setState(newState);
  }

  /**
   * Checks required fields and executes the onSubmit callback function
   *
   * @param {Event} e
   */
  handleSubmit(e) {
    e.preventDefault();
    const errors = [];
    // check required fields
    if (this.props.schema.required && this.props.schema.required.length) {
      this.props.schema.required.forEach(key => {
        // if the required fields are empty
        if (!this.state.formData[key]) {
          errors.push(key);
        }
      });
    }
    if (errors.length) {
      // execute the onError callback
      if (this.props.onError) {
        this.props.onError.call(this, errors);
      }
    }
    // execute the onSubmit callback
    if (this.props.onSubmit) {
      this.props.onSubmit.call(this, e);
    }
  }

  render() {
    const { children, schema } = this.props;
    const { formData } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <SchemaField
          schema={schema}
          formData={formData}
          onChange={this.handleFieldChange}
          onAddItem={this.handleAddItem}
          onDeleteItem={this.handleDeleteItem}
        />
        {children}
      </form>
    );
  }
}

Form.propTypes = {
  schema: PropTypes.object,
  formData: PropTypes.object,
  onError: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.any,
};

export default Form;
