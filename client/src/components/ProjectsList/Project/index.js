import ProjectSmall from './ProjectSmall'
import ProjectLarge from './ProjectLarge'

const Project = ({size, ...rest}) => {
    const project = {
        small: <ProjectSmall {...rest}/>,
        large: <ProjectLarge {...rest}/>
    }

    return project[size]        
}

export default Project
