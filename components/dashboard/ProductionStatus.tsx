"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const productionRate = 95.6

const ProductionStatus: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, x: 50 }
    }
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
  >
    <Card className="h-full" >
      <CardHeader>
        <CardTitle className="flex items-center" >
          <Activity className="mr-2" />
          Production Status
        </CardTitle>
      </CardHeader>
      < CardContent >
        <div className="grid grid-cols-2 gap-4" >
          <div>
            <p className="font-semibold" > Production Rate: </p>
            < p className="text-2xl font-bold text-green-500" > {productionRate} % </p>
          </div>
          < div >
            <p className="font-semibold" > Devices Produced: </p>
            < p className="text-2xl font-bold" >
              101 / 220
            </p>
          </div>
          < div >
            <p className="font-semibold" > Estimated Completion: </p>
            < p className="text-2xl font-bold" > 1h 30m </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default ProductionStatus;