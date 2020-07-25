import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import './InfoBox.css'

function InfoBox({ title, cases, active, isOrange, isRed, isGreen, total, ...props }) {
  return (
    <Card className={`infoBox ${active && 'infoBox--selected'} 
    ${isOrange && 'infoBox--orange'} ${isRed && 'infoBox--red'}`} 
    onClick={props.onClick}>
      <CardContent>
        <Typography color='textSecondary' className='infoBox__title'>{title} total</Typography>
        <h2 className={`infoBox__cases ${isGreen && 'infoBox--green'}`}>{cases}</h2>
        <Typography className='infoBox__total' color='textSecondary'>{total} total</Typography>
      </CardContent>

    </Card>
  )
}

export default InfoBox
