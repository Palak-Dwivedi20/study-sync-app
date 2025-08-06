import React from 'react'

function Footer() {
    return (
        <footer className="sticky bottom-0 left-0 right-0 text-center py-6 text-sm bg-black text-blue-100">
            &copy; {new Date().getFullYear()} StudySync. All rights reserved.
        </footer>
    )
}

export default Footer
