
import './App.css'

function App() {


  return (
    <>
        <div>
            <input type="text" />
            <button>Search</button>
        </div>

        <div>
            <button>Create new book</button>
            <button>update book </button>
            <button>Create new author</button>
            <button>Create new genre</button>
            <button>update book</button>
        </div>

        <div className="container">
            <div>
                <h1>Books</h1>
                <ul>
                    <li>book 1</li>
                    <li>book 2</li>
                    <li>book 3</li>
                </ul>
            </div>

            <div>
                <h1>Authors</h1>
                <ul>
                    <li>Authors 1</li>
                    <li>Authors 2</li>
                </ul>
            </div>
        </div>

    </>
  )
}

export default App
