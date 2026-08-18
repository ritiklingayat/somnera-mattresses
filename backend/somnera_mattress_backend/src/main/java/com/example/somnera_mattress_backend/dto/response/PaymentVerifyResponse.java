package com.example.somnera_mattress_backend.dto.response;

import com.example.somnera_mattress_backend.entity.OrderStatus;
import com.example.somnera_mattress_backend.entity.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentVerifyResponse {


    private Long orderId;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private PaymentStatus paymentStatus;

    private OrderStatus orderStatus;
}