import React, { Component } from 'react';
import { MdInsertDriveFile } from 'react-icons/md'
import Dropzone from 'react-dropzone'
import socket from 'socket.io-client'

import api from '../../services/api'
import logo from '../../assets/logo.svg'
import '../../css/box.css'

export default class Box extends Component {
	state = { box: {} }


	async componentDidMount() {
		this.subscribeToNewFiles()

		const box = this.props.match.params.id
		const response = await api.get(`boxes/${box}`)

		this.setState({ box: response.data })
	}

	subscribeToNewFiles = () => {
		const box = this.props.match.params.id
		const io = socket('https://omnistack-backend.herokuapp.com')

		io.emit('connectRoom', box)
		io.on('file', data => {
			this.setState({ box: { ...this.state.box, files: [data, ...this.state.box.files ] } })
		})

	}


	handledUpload = (files) => {
		files.forEach(file => {
			const data = new FormData()
			const box = this.props.match.params.id


			data.append('file', file)

			api.post(`boxes/${box}/files`, data)
		})
	}

	render() {
		return (
			<div id="box-container">
				<div className='header'>
					<img src={logo} alt="" />
					<h1>{this.state.box.title}</h1>
				</div>

				<Dropzone onDropAccepted={this.handledUpload}>
					{({ getRootProps, getInputProps }) => (
						<div className="upload" {...getRootProps()}>
							<input {...getInputProps()} />

							<p>Arraste arquivos ou clique aqui</p>
						</div>
					)}
				</Dropzone>

				<ul>
					{this.state.box.files && this.state.box.files.map(file => (
						<li key={file._id}>
							<a className='fileInfo' href={file.url} target='_blank'>
								<MdInsertDriveFile
									size={24}
									color='#a5cfff'
								/>
								<strong>{file.title}</strong>
							</a>

							<span>{file.createdAt}</span>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
