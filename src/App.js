import React, { Component } from 'react';
import { Table, Button, Modal } from 'antd';
import fetchUtils from './fetchUtils';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      name: '',
      email: '',
      mobile: ''
    }
  }

  componentDidMount = async () => {
    const response = await axios('http://localhost:3000/shippers')
    console.log(response);
    this.setState({ data: response.data.result })
  }

  handleOk = () => this.setState({ visible: true })
  handleCancel = () => this.setState({ visible: false })

  onChangeName = (event) => this.setState({ name: event.target.value })

  onChangeEmail = (event) => this.setState({ email: event.target.value })

  onChangeMobile = (event) => this.setState({ mobile: event.target.value })

  addUser = async () => {
    const body = {
      name: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile
    }
    const response = await fetchUtils.post('/shippers', body);
    console.log(response)
    this.setState({ newUser: response.result });
  }
  render() {
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'email',
      dataIndex: 'email',
      key: 'age',
    },
    {
      title: 'mobile',
      dataIndex: 'mobile',
      key: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Active',
      dataIndex: 'isActived',
      key: 'isActive',
    }];

    return (
      <div className="App">
        <h1>Danh sách</h1>
        <Button onClick={this.handleOk}>Them moi </Button>
        {this.state.visible &&
          <Modal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.addUser}
            onCancel={this.handleCancel}
          >
            <form>
              <input type="text" value={this.state.name} onChange={this.onChangeName} />
              <input type="text" value={this.state.email} onChange={this.onChangeEmail} />
              <input type="text" value={this.state.mobile} onChange={this.onChangeMobile} />
            </form>
          </Modal>}
        {this.state.newUser && <span>{JSON.stringify(this.state.newUser)}</span>}
        {
          this.state.data &&
          <Table
            dataSource={this.state.data}
            columns={columns}
          />
        }
      </div>
    );
  }
}

export default App;
