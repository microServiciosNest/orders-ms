import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination-dto';
import { firstValueFrom, last } from 'rxjs';
import { ChangeOrderStatusDto } from './dto/change-order-status';
import { PRODUCT_SERVICE } from 'src/config';


@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    // this.logger.log('DataBase Connected');
  }


  async create(createOrderDto: CreateOrderDto) {

    const ids = [3,4];
    const products = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate_product' }, ids)
    )
    return products;
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {

    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status,
      },
    })

    const currentPage = orderPaginationDto.page || 1
    const perPage = orderPaginationDto.limit || 10

    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: orderPaginationDto.status,
        },
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),

      }


    }


  }


  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: { id },
    })

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      })
    }

    return order;
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {

    const { id, status } = changeOrderStatusDto;
    const order = await this.findOne(id)

    if (order.status === status) { return order; }

    return this.order.update({
      where: { id },
      data: { status: status },
    })
  }




}
