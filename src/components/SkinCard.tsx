interface SkinCardProps {
    name?: string
    price?: string;
}

function SkinCard(props: SkinCardProps) {
    return (
        <div>
            <h3>{props.name}</h3>
            <h4>{props.price}</h4>
        </div>
    )
}

export default SkinCard;