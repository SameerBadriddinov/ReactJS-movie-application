import { useState, useEffect } from 'react'
import AppInfo from '../app-info/app-info'
import SearchPanel from '../search-panel/search-panel'
import AppFilter from '../app-filter/app-filter'
import MovieList from '../movie-list/movie-list'
import MoviesAddForm from '../movies-add-form/movies-add-form'
import { v4 as uuidv4 } from 'uuid'

import './app.css'

const App = () => {
	const [data, setData] = useState([])
	const [term, setTerm] = useState('')
	const [filter, setFilter] = useState('all')
	const [isLoading, setIsLoading] = useState(false)

	const onDelete = id => {
		const newArr = data.filter(c => c.id !== id)
		setData(newArr)
	}

	const addForm = item => {
		const newItem = {
			name: item.name,
			viewers: item.viewers,
			id: uuidv4(),
			favourite: false,
			like: false,
		}
		const newArr = [...data, newItem]
		setData(newArr)
	}

	const onToggleProp = (id, prop) => {
		const newArr = data.map(item => {
			if (item.id === id) {
				return { ...item, [prop]: !item[prop] }
			}
			return item
		})
		setData(newArr)
	}

	const searchHandler = (arr, term) => {
		if (term === 0) {
			return arr
		}

		return arr.filter(item => item.name.toLowerCase().indexOf(term) > -1)
	}

	const filterHandler = (arr, filter) => {
		switch (filter) {
			case 'popular':
				return arr.filter(c => c.like)
			case 'mostViewers':
				return arr.filter(c => c.viewers > 800)
			default:
				return arr
		}
	}

	const updateTermHandler = term => setTerm(term)

	const updateFilterHandler = filter => setFilter(filter)

	useEffect(() => {
		setIsLoading(true)
		fetch('https://jsonplaceholder.typicode.com/todos?_start=0&_limit=5')
			.then(response => response.json())
			.then(json => {
				const newArr = json.map(item => ({
					name: item.title,
					id: item.id,
					viewers: item.id * 10,
					favourite: false,
					like: false,
				}))
				setData(newArr)
			})
			.catch(err => console.log(err))
			.finally(() => setIsLoading(false))
	}, [])

	return (
		<div className='app font-monospace'>
			<div className='content'>
				<AppInfo
					allMoviesCount={data.length}
					favouriteMovieCount={data.filter(c => c.favourite).length}
				/>
				<div className='search-panel'>
					<SearchPanel updateTermHandler={updateTermHandler} />
					<AppFilter filter={filter} updateFilterHandler={updateFilterHandler} />
				</div>
				{isLoading && 'Loading..'}
				<MovieList
					onToggleProp={onToggleProp}
					data={filterHandler(searchHandler(data, term), filter)}
					onDelete={onDelete}
				/>
				<MoviesAddForm addForm={addForm} />
			</div>
		</div>
	)
}

export default App
